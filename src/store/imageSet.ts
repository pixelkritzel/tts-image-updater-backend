import { storeResponse } from './storeResponse';
import { SnapshotIn, types, Instance, SnapshotOut } from 'mobx-state-tree';
import { v4 as uuid4 } from 'uuid';

const imageModel = types.model({
  id: types.optional(types.identifier, uuid4),
  url: types.string,
  name: types.optional(types.string, ''),
});

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
    setSelectedImageId(selectedImageId: string): storeResponse {
      if (self.images.has(selectedImageId)) {
        self.selectedImageId = selectedImageId;
        return { type: 'SUCCESS' };
      } else {
        return { type: 'ERROR' };
      }
    },
  }));

export type IimageSet = Instance<typeof imageSetModel>;
export type SIimageSet = SnapshotIn<typeof imageSetModel>;
