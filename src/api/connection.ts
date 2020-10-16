import express from 'express';
import { autorun } from 'mobx';

import { ImageSet } from './../entity/ImageSet';

import { trackingMap } from './../utils/dirtyTracking';

export const router = express.Router();

export const connection = router.get('/:imageSetId', async (req, res) => {
  console.log('timestamp:', req.query.timestamp)
  const { imageSetId } = req.params;
  var timeoutId = setTimeout(() => {
    disposer && disposer();
    res.send();
  }, 30000);
  const disposer = autorun(async () => {
    if (trackingMap.get(imageSetId)) {
      disposer();
      clearTimeout(timeoutId);
      const imageSet = await ImageSet.findOne({ id: Number(imageSetId) });
      trackingMap.set(imageSetId, false);
      res.send(imageSet?.selectedImage.url);
    }
  });
});
