import { imageModel } from './../store/imageSet';
import { getSnapshot } from 'mobx-state-tree';
import express from 'express';
import multer from 'multer';
import fsOld from 'fs';
import path from 'path';
import { v4 as uuid4 } from 'uuid';

import { store } from './../store/store';
import { getJson } from '../utils/getJson';

import { authenticateUser, resolveImage, resolveImageSet, resolveUser } from './middlewares';

const fs = fsOld.promises;

const users = express.Router();

// users.use('/:username', authenticateUser);
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

users.post('/:username/image-sets', async (req, res) => {
  const response = req.user!.addImageSet(req.body);
  if (response.type === 'SUCCESS') {
    res.send(response.data);
  } else {
    res.statusCode = 422;
    res.send(response.message);
  }
});

users.get('/:username/image-sets/', async (req, res) => {
  res.send(getJson(req.user!.imageSets));
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
    req.image = imageModel.create({
      url: `http://localhost:3000/images/${req.user?.imageDirectory}/${fileName}`,
    });
    cb(null, fileName);
  },
});

var upload = multer({ storage });

users.post('/:username/image-sets/:imageSetId/images', upload.single('image'), async (req, res) => {
  const newImage = req.imageSet?.addImage(req.image!);
  res.send(newImage);
});

users.get('/:username/image-sets/:imageSetId/images/:imageId', async (req, res) => {
  res.send(getJson(req.image!));
});

users.delete('/:username/image-sets/:imageSetId/images/:imageId', async (req, res) => {
  req.imageSet!.deleteImage(req.image!);
  res.send();
});

export { users };
