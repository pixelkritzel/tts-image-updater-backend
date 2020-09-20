import {
  SnapshotIn,
  types,
  Instance,
  getSnapshot,
  applyPatch,
  IJsonPatch,
  cast,
} from 'mobx-state-tree';
import { v4 as uuid4 } from 'uuid';
import { runImageSetSideEffects } from './runImageSetPatchSideEffects';

import { storeResponse } from './storeResponse';

export const imageModel = types.model({
  id: types.optional(types.identifier, uuid4),
  url: types.string,
  name: types.optional(types.string, ''),
});

export type Iimage = Instance<typeof imageModel>;
type SIimageModel = SnapshotIn<typeof imageModel>;

const imageModelMap = types.map(imageModel);

export const imageSetModel = types
  .model({
    id: types.optional(types.identifier, uuid4),
    name: types.optional(types.string, ''),
    images: types.snapshotProcessor(
      imageModelMap,
      {
        preProcessor(sn: SIimageModel[]) {
          return sn.reduce((accu, curr) => {
            const id = curr.id ?? uuid4();
            accu[id] = curr;
            return accu;
          }, {} as { [key: string]: SIimageModel });
        },
        postProcessor(sn): SIimageModel[] {
          return Object.values(sn);
        },
      },
      'images in ImageSet'
    ),
    defaultImageId: types.optional(types.string, ''),
    selectedImageId: types.optional(types.string, ''),
    temporaryImageData: types.maybe(types.array(types.frozen())),
  })
  .volatile((self) => ({
    isDirty: false,
  }))
  .views((self) => ({
    get selectedImage() {
      const selectedImage = self.selectedImageId
        ? self.images.get(self.selectedImageId)
        : self.images.get(self.defaultImageId);
      if (!selectedImage) {
        throw new Error(`Neither selected nor default image on image set ${self.id}`);
      }
      return selectedImage;
    },
  }))
  .actions((self) => ({
    afterCreate() {
      self.defaultImageId = [...self.images.values()][0].id;
    },
  }))
  .actions((self) => ({
    addImages(newImages: SIimageModel[]) {
      newImages.forEach((image, index) => {
        const id = uuid4();
        self.images.set(id, { id, ...image });
        if (index === 0) {
          self.selectedImageId = id;
        }
      });

      return getSnapshot(self);
    },
    addTemporaryImageData(image: SIimageModel) {
      if (self.temporaryImageData) {
        self.temporaryImageData.push(image);
      } else {
        self.temporaryImageData = cast([image]);
      }
    },
    resetTemporaryImageData() {
      self.temporaryImageData = undefined;
    },
    deleteImage(image: Iimage) {
      self.images.delete(image.id);
    },
    update(patch: IJsonPatch): storeResponse {
      try {
        applyPatch(self, patch);
        runImageSetSideEffects(self as any, patch);
        return { type: 'SUCCESS', data: self };
      } catch (e) {
        console.log(e);
        return { type: 'ERROR', data: e };
      }
    },
    setSelectedOrDefaultImageId(
      imageId: string,
      which: 'selectedImageId' | 'defaultImageId'
    ): storeResponse {
      if (self.images.has(imageId)) {
        self[which] = imageId;
        self.isDirty = true;
        return { type: 'SUCCESS', data: self.images.get(imageId) };
      } else {
        return {
          type: 'ERROR',
          message: `Imageset ${self.id} doesn't contain image ${imageId}`,
        };
      }
    },
  }));

export interface IimageSet extends Instance<typeof imageSetModel> {}
export interface SIimageSet extends SnapshotIn<typeof imageSetModel> {}
