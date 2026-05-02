import { baseApi } from "./api/baseApi";
import imageReducer from "./slice/imageSlice";
import pageReloadReducer from "./slice/reloadSlice";
import searchReducer from "./slice/searchSlice";
import resetReducer from "./slice/resetForm";
import searchItemShowReducer from "./slice/searchItemShowSlice";
import estimateItemShowReducer from "./slice/estimateItemShowSlice";
import carReducer from "./slice/CarSlice";
import selectionReducer from "./slice/selectionSlice";
import relatedItemHandleReducer from "./slice/relatedItemHandleSlice";
import deleteInspectionReducer from "./slice/deleteInspectionSlice";
import deleteContactReducer from "./slice/deleteContactSlice";
import deleteEstimateReducer from "./slice/deleteEstimateSlice";
import appointmentReducer from "./slice/appointmentSlice";
import deleteLaborReducer from "./slice/deleteLaborSlice";
import serviceInspectionItemReducer from "./slice/serviceInspectionItemSlice";
import serviceItemAssignReducer from "./slice/serviceAdvisorSlice";
import itemDeleteReducer from "./slice/itemDeletionSlice";

export const reducer = {
  imageUrl: imageReducer,
  pageReload: pageReloadReducer,
  search: searchReducer,
  reset: resetReducer,
  searchItemShow: searchItemShowReducer,
  estimateItemShow: estimateItemShowReducer,
  carGroupInfo: carReducer,
  selection: selectionReducer,
  relatedItemHandleDB: relatedItemHandleReducer,
  deleteInspection: deleteInspectionReducer,
  deleteContact: deleteContactReducer,
  deleteEstimate: deleteEstimateReducer,
  appointmentItemShow: appointmentReducer,
  deleteLabor: deleteLaborReducer,
  serviceInspectionItem: serviceInspectionItemReducer,
  serviceItemAssign: serviceItemAssignReducer,
  itemDelete: itemDeleteReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};
