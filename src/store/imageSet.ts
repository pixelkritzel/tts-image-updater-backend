import { types } from 'mobx-state-tree';
import { v4 as uuid4 } from 'uuid';

const imageModel = types.model({
  id: types.optional(types.identifier, uuid4),
  url: types.string,
  name: types.optional(types.string, ''),
});

export const imageSetModel = types.model({
  id: types.optional(types.identifier, uuid4),
  name: types.string,
  defaultImage: types.reference(imageModel),
  selectedImage: types.reference(imageModel),
  images: types.map(imageModel),
});
