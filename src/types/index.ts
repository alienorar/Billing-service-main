import { AnyObject } from "antd/es/_util/type";
import { ColumnsType, TablePaginationConfig, TableProps } from "antd/es/table";

// ========== PARAMS TYPE ==========
export interface ParamsType {
  studentId?: number | string;
  passport?: string;
  size?: number | string | undefined,
  page?: number | string | undefined,
  search?: string,
  phone?: number | string,
  firstName?: string;
  lastName?: string;
  studentIdNumber?: string;
  pinfl?: string;
  provider?: string;
  name?: string | undefined,
  state?: string | undefined;
  from?: string | number;
  to?: string | number;
  educationForm?: string | undefined;
  educationType?: string | undefined;
  educationLang?: string | undefined;
  active?: string | undefined;
  showDebt?: string;
  type?: string
  sortBy?: string,
  direction?: string,
  timeUnit?:string,
  count?:number|string
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
  loading?: boolean;

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
  id?: number;
  name?: string;
  duration?: number | any;
  contractAmounts?: string | number | any;
  groupIds: any[];
}

export interface GroupListUpdate {
  groupId?: number | string;
  paymentGroupId?: number | string;
  id?: number | string;
  visible: boolean,
  debtLevel: number | string
}


export interface AvailableGroup {
  id: number;
  hemisId: number;
  name: string;
  educationLang: string;
  educationForm: string;
  educationType: string;
  curriculum: number;
  active: boolean;
  specialityFormId: number;
  paymentGroupId: number | null;
  level: number | null;
}

export interface Speciality {
  id: number;
  name: string;
  duration: number;
  educationForm: string;
  educationType: string;
  groups: AvailableGroup[];
}

export interface AvailableGroupListResponse {
  data: Speciality[];
}

export interface PaymentGroup {
  id?: number;
  name?: string;
  duration?: number | any;
  contractAmounts?: any;
  groupIds: any[];
  groups?: number[];
}

export interface ContractAmountForm {
  key: string;
  amount: number | any;
}

export interface PmtGroupFormValues {
  name: string;
  duration: number;
  contractAmounts: ContractAmountForm[];
  groupIds: any[];
}


export interface StudentDiscount {
  id?: number | string
  studentId?: number;
  description?: string;
  discountType?: "SUM";
  studentLevel?: number;
  amount?: number;
};

export interface DebtRecord {
  id?: number;
  firstName?: string;
  lastName?: string;
  paymentDetails?: {
    studentDebtAmount?: number;
    studentContractAmount?: number;
    studentPaidAmount?: number;
    studentDiscountAmount?: number;
  };

  studentId?: number | string;
  description?: string;
  reasonFile?: string;
  debtType?: string;
  studentLevel?: number;
  amount?: number;

}