'use strict';

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isBookingDetailLoading: false,
  bookingDetailData: {},
  isRatingServiceLoading: false,
  isRatingPhlebotomistLoading: false,
  isPostReviewLoading: false,
  downloadPDFData: {},
  downloadPDFInvoiceData: {},
  isDownloadPDFLoading: false,
  isDownloadPDFInvoiceLoading: false,
};

export const bookingDetailState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.BOOKING_DETAIL_SHOW_LOADING:
      return {...state, isBookingDetailLoading: true};
    case ACTIONS.BOOKING_DETAIL_HIDE_LOADING:
      return {...state, isBookingDetailLoading: false};
    case ACTIONS.SHOW_BOOKING_SERVICE_RATINGS_LOADING:
      return {...state, isRatingServiceLoading: true};
    case ACTIONS.HIDE_BOOKING_SERVICE_RATINGS_LOADING:
      return {...state, isRatingServiceLoading: false};
    case ACTIONS.SHOW_BOOKING_RATINGS_LOADING:
      return {...state, isRatingPhlebotomistLoading: true};
    case ACTIONS.HIDE_BOOKING_RATINGS_LOADING:
      return {...state, isRatingPhlebotomistLoading: false};
    case ACTIONS.SHOW_BOOKING_POST_REVIEW_LOADING:
      return {...state, isPostReviewLoading: true};
    case ACTIONS.HIDE_BOOKING_POST_REVIEW_LOADING:
      return {...state, isPostReviewLoading: false};
    case ACTIONS.BOOKING_DETAIL_DATA:
      return {...state, bookingDetailData: action.payload};
    case ACTIONS.BOOKING_DETAIL_DOWNLOAD_REPORT:
      return {...state, downloadPDFData: action.payload};
    case ACTIONS.BOOKING_DETAIL_DOWNLOAD_INVOICE:
      return {...state, downloadPDFInvoiceData: action.payload};
    case ACTIONS.SHOW_LOADING_DOWNLOAD_REPORT:
      return {...state, isDownloadPDFLoading: true};
    case ACTIONS.HIDE_LOADING_DOWNLOAD_REPORT:
      return {...state, isDownloadPDFLoading: false};
    case ACTIONS.SHOW_LOADING_DOWNLOAD_INVOICE:
      return {...state, isDownloadPDFInvoiceLoading: true};
    case ACTIONS.HIDE_LOADING_DOWNLOAD_INVOICE:
      return {...state, isDownloadPDFInvoiceLoading: false};
    default:
      return state;
  }
};
