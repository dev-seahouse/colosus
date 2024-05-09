import { currencyFormatter } from '@bambu/go-core';

// TODO: move this to core or somewhere else
// ! When updating this, also do a global search for MIN_RECURRING_DEPOSIT and update accordingly
// or better yet, help use to move this to a shared file

/** Validation Schema */
export const MIN_RECURRING_DEPOSIT = 25; // from BE
export const MIN_INITIAL_DEPOSIT = 25; // from BE

export const MIN_INITIAL_DEPOSIT_MSG = `Your min deposit is ${currencyFormatter(
  String(MIN_INITIAL_DEPOSIT)
)} or higher`;
export const MIN_RECURRING_DEPOSIT_MSG = `Your min monthly recurring deposit is ${currencyFormatter(
  MIN_RECURRING_DEPOSIT
)} or higher`;
