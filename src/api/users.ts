import { getSnapshot } from 'mobx-state-tree';
import express from 'express';

import { store } from './../store/store';
import { authenticateUser, resolveImage, resolveImageSet, resolveUser } from './middlewares';
import { getJson } from '../utils/getJson';

const users = express.Router();

users.use('/:userName', authenticateUser);
users.use('/:userName', resolveUser);
users.use('/:userName/image-sets/:imageSetId', resolveImageSet);
users.use('/:userName/image-sets/:imageSetId/images/:imageId', resolveImage);

users.get('/:userName', (req, res) => {
  const userSnapShot = { ...(getSnapshot(req.user!) as any) };
  delete userSnapShot.pwHash;
  delete userSnapShot.session;
  res.send(JSON.stringify(userSnapShot));
});

users.delete('/:userName', (req, res) => {
  store.deleteUser(req.user!);
  res.send();
});

users.post('/:userName/image-sets', async (req, res) => {
  const response = req.user!.addImageSet(req.body);
  if (response.type === 'SUCCESS') {
    res.send(response.data);
  } else {
    res.statusCode = 422;
    res.send(response.message);
  }
});

users.get('/:userName/image-sets/', async (req, res) => {
  res.send(getJson(req.user!.imageSets));
});

users.get('/:userName/image-sets/:imageSetId', async (req, res) => {
  res.send(getJson(req.imageSet!));
});

users.delete('/:userName/image-sets/:imageSetId', async (req, res) => {
  req.user!.deleteImageSet(req.params.imageSetId);
});

users.put('/:userName/image-sets/:imageSetId', async (req, res) => {
  const response = req.imageSet!.update(req.body);
  if (response.type === 'SUCCESS') {
    res.send(getJson(response.data));
  } else {
    res.status(422).send({ error: response.data });
  }
});

users.post('/:userName/image-sets/:imageSetId/images', async (req, res) => {
  const response = req.imageSet!.addImage(req.body);
  if (response.type === 'SUCCESS') {
    res.send(response.data);
  } else {
    res.statusCode = 422;
    res.send();
  }
});

users.get('/:userName/image-sets/:imageSetId/images/:imageId', async (req, res) => {
  res.send(getJson(req.image!));
});

users.delete('/:userName/image-sets/:imageSetId/images/:imageId', async (req, res) => {
  req.imageSet!.deleteImage(req.image!);
  res.send();
});

export { users };
