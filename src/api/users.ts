import { getSnapshot } from 'mobx-state-tree';
import express from 'express';

import { store } from './../store/store';

const users = express.Router();

users.get('/:userName', (req, res) => {
  const user = store.users.get(req.params.userName);
  if (user) {
    const userSnapShot = { ...(getSnapshot(user) as any) };
    delete userSnapShot.pwHash;
    delete userSnapShot.session;
    res.send(JSON.stringify(userSnapShot));
  } else {
    res.statusCode = 404;
    res.send();
  }
});

users.post('/:userName/image-sets', async (req, res) => {
  const user = store.users.get(req.params.userName);
  if (user) {
    const response = user.createImageSet(req.body);
    if (response.type === 'SUCCESS') {
      res.send(response.data);
    } else {
      res.statusCode = 422;
      res.send(response.message);
    }
  } else {
    res.statusCode = 404;
    res.send();
  }
});

users.get('/:userName/image-sets/', async (req, res) => {
  const user = store.users.get(req.params.userName);
  if (user) {
    const imageSets = JSON.stringify(getSnapshot(user.imageSets));
    res.end(imageSets);
  } else {
    res.statusCode = 404;
    res.send();
  }
});

users.get('/:userName/image-sets/:imageSetId', async (req, res) => {
  const { userName, imageSetId } = req.params;
  const user = store.users.get(userName);
  const imageSet = user?.imageSets.get(imageSetId);
  if (user && imageSet) {
    const imageSetData = JSON.stringify(getSnapshot(imageSet));
    res.end(imageSetData);
  } else {
    res.statusCode = 404;
    res.send();
  }
});

users.delete('/:userName/image-sets/:imageSetId', async (req, res) => {
  const user = store.users.get(req.params.userName);
  if (user) {
    user.deleteImageSet(req.params.imageSetId);
  } else {
    res.statusCode = 404;
    res.send();
  }
});

users.put('/:userName/image-sets/:imageSetId/selected-image', async (req, res) => {
  const { userName, imageSetId } = req.params;
  const { selectedImageId } = req.body;
  const user = store.users.get(req.params.userName);
  const imageSet = user?.imageSets.get(imageSetId);
  if (user && imageSet && selectedImageId === 'string') {
    const response = imageSet.setSelectedImageId(selectedImageId);
    if (response.type === 'SUCCESS') {
      res.send();
    } else {
      res.statusCode = 422;
      res.send();
    }
  } else {
    res.statusCode = 404;
    res.send();
  }
});

export { users };
