import { trackingMap } from './../utils/dirtyTracking';
import { ImageSet } from './../entity/ImageSet';
import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class ImageSetSubscriber implements EntitySubscriberInterface<ImageSet> {
  isDirty = false;

  listenTo() {
    return ImageSet;
  }

  beforeUpdate(event: UpdateEvent<ImageSet>) {
    this.isDirty = event.entity.selectedImage.id !== event.databaseEntity.selectedImage.id
  }

  afterUpdate(event: UpdateEvent<ImageSet>) {
    if (this.isDirty) {
      trackingMap.set(
        event.entity.id.toString(),
        true
      );
      this.isDirty = false
    }
  }
}
