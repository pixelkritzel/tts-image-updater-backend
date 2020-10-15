
import express from 'express';
import { reaction } from 'mobx';

import { ImageSet } from './../entity/ImageSet';

import { trackingMap } from './../utils/dirtyTracking';

export const router = express.Router();

export const connection = router.get('/:imageSetId', async (req, res) => {
  const { imageSetId } = req.params;
  const imageSet = await ImageSet.findOne({ id: Number(imageSetId) })
  if (!imageSet) {
    res.statusCode = 404;
    res.send();
    return;
  }
  if (trackingMap.get(imageSetId)) {
    trackingMap.set(imageSetId, false);
    res.send(imageSet.selectedImage.url);
  }
  else {
    var timeoutId = setTimeout(() => {
      disposer();
      res.send();
    }, 1000);
    const disposer = reaction(() => trackingMap.get(imageSetId),
      () => {
        clearTimeout(timeoutId);
        res.send(imageSet.selectedImage.url);
        trackingMap.set(imageSetId, false);
      }
    )
  }
});
