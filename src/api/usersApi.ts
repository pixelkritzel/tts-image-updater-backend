import express from 'express';
import multer from 'multer';
import fsOld from 'fs';
import path from 'path';
import { v4 as uuid4 } from 'uuid';

import { Image } from './../entity/Image';
import { ImageSet } from './../entity/ImageSet';
import { authenticateUser, resolveImage, resolveImageSet, resolveUser } from './middlewares';

const fs = fsOld.promises;

const users = express.Router();

users.use('/:username', authenticateUser);
users.use('/:username', resolveUser);
users.use('/:username/image-sets/:imageSetId', resolveImageSet);
users.use('/:username/image-sets/:imageSetId/images/:imageId', resolveImage);

users.get('/:username', async (req, res) => {
  res.json(req.locals?.user);
});

users.delete('/:username', async (req, res) => {
  await req.locals?.user!.remove();
  res.send();
});

users.get('/:username/image-sets/', async (req, res) => {
  const imageSets = req.locals?.user;
  res.json(imageSets);
});

users.post('/:username/image-sets', async (req, res) => {
  const imageSet = new ImageSet();
  imageSet.user = req.locals?.user!;
  await imageSet.save();
  res.json(imageSet);
});

users.get('/:username/image-sets/:imageSetId', async (req, res) => {
  res.json(req.locals?.imageSet);
});

users.delete('/:username/image-sets/:imageSetId', async (req, res) => {
  const deleteAllImages = req.locals?.imageSet?.images.map(async (image) => await image.remove())!;
  await Promise.all(deleteAllImages);
  await req.locals?.imageSet?.remove();
  res.send();
});

users.put('/:username/image-sets/:imageSetId', async (req, res) => {
  const imageSet = req.locals?.imageSet!;
  Object.assign(imageSet, req.body);
  await imageSet.save();
  res.json(imageSet);
});

var storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const targetPath = `${process.cwd()}/images/${req.locals?.user?.imageDirectory}`;
    if (!fsOld.existsSync(targetPath)) {
      await fs.mkdir(targetPath);
    }
    cb(null, targetPath);
  },
  filename: async function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const fileName = uuid4() + fileExtension;
    const url = `${process.env.BASE_URL}/images/${req.locals?.user?.imageDirectory}/${fileName}`;
    const image = new Image(url, req.locals?.imageSet!);
    await image.save();
    cb(null, fileName);
  },
});

var upload = multer({ storage });

users.post('/:username/image-sets/:imageSetId/images', upload.array('images'), async (req, res) => {
  res.json(await ImageSet.findOne({ id: Number(req.params.imageSetId) }));
});

users.get('/:username/image-sets/:imageSetId/images/:imageId', async (req, res) => {
  res.json(req.locals?.image!);
});

users.delete('/:username/image-sets/:imageSetId/images/:imageId', async (req, res) => {
  await req.locals?.image?.remove();
  res.send();
});

export { users };
