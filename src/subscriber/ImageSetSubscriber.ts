import { trackingMap } from './../utils/dirtyTracking';
import { ImageSet } from './../entity/ImageSet';
import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class ImageSetSubscriber implements EntitySubscriberInterface<ImageSet> {
  selectedImage?: number;

  listenTo() {
    return ImageSet;
  }

  beforeUpdate(event: UpdateEvent<ImageSet>) {
    this.selectedImage = event.entity.selectedImage.id;
  }

  afterUpdate(event: UpdateEvent<ImageSet>) {
    trackingMap.set(event.entity.id.toString(), this.selectedImage === event.entity.selectedImage.id);
  }
}
