import {
  authKey, openKeysNew, calendarView, createAppoinment, createConcern,
  createContact, createGeneralItem, createinspectionGroup, estimateCreate,
  formValues_loginUser, formValues_signupUser, formValues_updateService,
  LogOutUser, selectedMenuKey, sidebarCollapsed, valueEditSearch,
  valueMainSearch,
  currentView
} from "@/constant/storageKey";
import {  removeUserInfo } from "@/services/auth.service";
export const TokenStatusCheck=(exp:number)=>{

    if (exp) {
      const isExpired = Date.now() >= exp * 1000;
    
      if (isExpired) {
       
            const keysToRemove = [
              authKey, estimateCreate, selectedMenuKey, openKeysNew, sidebarCollapsed,
              createGeneralItem, createAppoinment, createConcern, createContact,
              LogOutUser, valueEditSearch, valueMainSearch, calendarView,
              createinspectionGroup, formValues_signupUser, formValues_loginUser,
              formValues_updateService,currentView
            ];
            keysToRemove.forEach(removeUserInfo);
      }
    }
}