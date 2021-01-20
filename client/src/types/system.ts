export interface System {
  System: string;
  Chart_Type: string;
  Item_No: number;
  Link_Type: string;
  SFreq_GHz: number;
  EFreq_GHz: number;
  SDate: Date;
  EDate: Date;
}

export interface Chart {
  Chart_Type: string;
  X_Axis_Start: number;
  X_Axis_Stop: number;
  X_Axis_Step_Size: number;
  Y_Axis_Start: number;
  Y_Axis_Stop: number;
  Y_Axis_Step_Size: number;
  data?: Array<any>
}
