import express from 'express';
import { when } from 'mobx';

import { store } from './../store/store';

export const router = express.Router();

export const connection = router.get('/:imageSetId', async (req, res) => {
	const { imageSetId } = req.params;
	const imageSet = store.getImageSetById(imageSetId);
	if (!imageSet) {
		res.statusCode = 404;
		res.send();
		return;
	}
	if (imageSet.isDirty) {
		res.send(imageSet.selectedImage.url);
		imageSet.setIsDirty(false);
	} else {
		var timeoutId = setTimeout(() => {
			disposer();
			res.send();
		}, 500);
		var disposer = when(
			() => imageSet.isDirty,
			() => {
				clearTimeout(timeoutId);
				res.send(imageSet.selectedImage.url);
				imageSet.setIsDirty(false);
			},
		);
	}
});
