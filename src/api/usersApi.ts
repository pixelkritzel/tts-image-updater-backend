import { getSnapshot } from 'mobx-state-tree';
import express from 'express';
import multer from 'multer';
import fsOld from 'fs';
import path from 'path';
import { v4 as uuid4 } from 'uuid';

import { store } from '../store/store';
import { getJson } from '../utils/getJson';

import { authenticateUser, resolveImage, resolveImageSet, resolveUser } from './middlewares';

const fs = fsOld.promises;

const users = express.Router();

users.use('/:username', authenticateUser);
users.use('/:username', resolveUser);
users.use('/:username/image-sets/:imageSetId', resolveImageSet);
users.use('/:username/image-sets/:imageSetId/images/:imageId', resolveImage);

users.get('/:username', (req, res) => {
  const userSnapShot = { ...(getSnapshot(req.user!) as any) };
  delete userSnapShot.pwHash;
  delete userSnapShot.session;
  res.send(JSON.stringify(userSnapShot));
});

users.delete('/:username', (req, res) => {
  store.deleteUser(req.user!);
  res.send();
});

users.get('/:username/image-sets/', async (req, res) => {
  res.send(getJson(req.user!.imageSets));
});

users.post('/:username/image-sets', async (req, res) => {
  const response = req.user!.addImageSet({ images: [] });
  if (response.type === 'SUCCESS') {
    res.send(response.data);
  } else {
    res.statusCode = 422;
    res.send(response.message);
  }
});

users.get('/:username/image-sets/:imageSetId', async (req, res) => {
  res.send(getJson(req.imageSet!));
});

users.delete('/:username/image-sets/:imageSetId', async (req, res) => {
  req.user!.deleteImageSet(req.params.imageSetId);
});

users.put('/:username/image-sets/:imageSetId', async (req, res) => {
  const response = req.imageSet!.update(req.body);
  if (response.type === 'SUCCESS') {
    res.send(getJson(response.data));
  } else {
    res.status(422).send({ error: response.data });
  }
});

var storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const targetPath = `${process.cwd()}/images/${req.user?.imageDirectory}`;
    if (!fsOld.existsSync(targetPath)) {
      await fs.mkdir(targetPath);
    }
    cb(null, targetPath);
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const uuid = uuid4();
    const fileName = uuid + fileExtension;
    const url = `${process.env.BASE_URL}/images/${req.user?.imageDirectory}/${fileName}`;
    req.imageSet!.addTemporaryImageData({ url });
    cb(null, fileName);
  },
});

var upload = multer({ storage });

users.post('/:username/image-sets/:imageSetId/images', upload.array('images'), async (req, res) => {
  const { imageSet } = req;
  if (imageSet!.temporaryImageData) {
    const newImage = imageSet?.addImages(imageSet!.temporaryImageData);
    imageSet?.resetTemporaryImageData();
    res.send(newImage);
  }
});

users.get('/:username/image-sets/:imageSetId/images/:imageId', async (req, res) => {
  res.send(getJson(req.image!));
});

users.delete('/:username/image-sets/:imageSetId/images/:imageId', async (req, res) => {
  req.imageSet!.deleteImage(req.image!);
  res.send();
});

export { users };
