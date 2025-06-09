import { AnyObject } from "antd/es/_util/type";
import { ColumnsType, TablePaginationConfig, TableProps } from "antd/es/table";

// ========== PARAMS TYPE ==========
export interface ParamsType {
  size?: number,
  page?: number,
  search?: string,
  phone?: number|string,
  firstName?: string;
  lastName?: string;
  studentIdNumber?:string;
  pinfl?:string;
  provider?:string;
  state?:any;
  from?:string|number;
  to?:string|number;
}

export interface PagingType {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}


export interface RolesResponse {
  message?: string;
  data: {
    content: RoleType[];
    paging: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };

  };
}

export interface AdminsResponse {
  message?: string | any;
  data: {
    content: AdminType[];
    paging: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };

  };
}

// ========== MODALS TYPE ==========
export interface GlobalModalProps {
  open?: boolean,
  loading?: boolean;
  handleClose: () => void,
  getData?: () => void,
}

// ==========GLOBAL TABLE TYPE ==========
export interface TablePropsType {
  columns: ColumnsType<AnyObject>;
  data: AnyObject[] | undefined;
  pagination: false | TablePaginationConfig | undefined;
  handleChange: (pagination: TablePaginationConfig) => void;
  onRow?: TableProps<AnyObject>["onRow"]; 
  loading?:boolean;

}
// ==========GLOBAL DELETE TYPE ==========
export interface ConfirmType {
  onConfirm: (id: number) => void;
  onCancel: () => void,
  id: number | undefined,
  title: string
}


// ============GLOBAL SEARCH=============
export interface SearchType {
  updateParams: (params: ParamsType) => void;
  placeholder?: string;
}


// ===========ROLE TYPE=============
export interface RoleType {
  id?: number;
  name?: string;
  displayName?: string;
  defaultUrl?: string;
  permissions?: number[];
  userPermissions?: { id: number; name: string; displayName: string }[];
}


export interface RoleModalType extends GlobalModalProps {
  update?: RoleType;
  permessionL?: any[];
  selectedPermL?: { id: number; name: string; displayName: string }[]; 
}


// ===========ADMIN TYPE=============
export interface AdminType {
  id?: number;
  roleId?: number;
  username?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}


export interface AdminModalType {
  open?: boolean;
  handleClose?: () => void;
  update?: AdminType | null;
  roles?: { id: string; name: string }[];
};


// ============== SPECIALITY TYPE ==========
export interface SpecialityType {
  id?: number;
  specialityCode: string;
  specialityName: string;
  contractCost?: number;
  contractCostInLetters?: string;
  duration?: string;
  educationForm: string;
  educationType: string;
  educationLang: string;
  isVisible: boolean;
}


export interface PaymentGroup {
  id: number | undefined;
  name: string;
  duration: number;
  contractAmounts: Record<string, number>;
  groupIds: number[];
}