export enum HUBSPOT_EVENTS {
  SUBSCRIBE = 'hubspot.subscribe',
  SUBSCRIBE_ERROR = 'hubspot.subscribe.error',
  CONTACT_UPDATE = 'hubspot.contact.update',
  CONTACT_UPDATE_ERROR = 'hubspot.contact.update.error',
  CREATE_DEAL = 'hubspot.create.deal',
  CREATE_DEAL_ERROR = 'hubspot.create.deal.error',
  UPDATE_DEAL_STAGE = 'hubspot.update.deal.stage',
  UPDATE_DEAL_STAGE_ERROR = 'hubspot.update.deal.stage.error',

  ENABLE_MARKETING = 'hubspot.enable.marketing',
  INITIALISE_DEAL_PIPELINE = 'hubspot.pipeline.create.deal',
  MOVE_DEAL_TO_WON = 'hubspot.pipeline.set.won',
  MOVE_DEAL_TO_LOST = 'hubspot.pipeline.set.lost',

  ENABLE_MARKETING_ERROR = 'hubspot.enable.marketing.error',
  INITIALISE_DEAL_PIPELINE_ERROR = 'hubspot.pipeline.create.deal.error',
  MOVE_DEAL_TO_WON_ERROR = 'hubspot.pipeline.set.won.error',
  MOVE_DEAL_TO_LOST_ERROR = 'hubspot.pipeline.set.lost.error',
}
