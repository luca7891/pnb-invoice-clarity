export type MatchStatus = "PASS" | "TOLERANCE_PASS" | "FAIL";

export interface InvoiceRecord {
  Invoice_ID: string;
  Vendor_Number: string;
  Vendor_Name?: string;
  Material_Number?: string;
  Plant?: string;
  PO_Number?: string;
  PO_Item?: string;
  PO_Type?: string;
  GR_Date?: string; // goods receipt date
  IR_Date?: string; // invoice receipt date
  Match_Date?: string; // agent1 match date
  Resolution_Date?: string; // agent3 resolution date
  Block_Date?: string;
  Payment_Date?: string;
  Payment_Terms?: string;

  // Agent 1
  Match_Status?: MatchStatus;
  Root_Cause_Code?: string;
  Tolerance_Pass_Flag?: boolean;
  Escalation_Flag?: boolean;

  // Agent 2
  Exception_Type?: string;
  Root_Cause?: string; // System | Policy | Master Data | Other
  Confidence_Score?: number; // 0-1
  Cluster_ID?: string;
  Suggested_Action?: string;

  // Agent 3
  Block_Reason?: string;
  Resolution_Suggestion?: string;
  Responsible_Team?: string;
  Auto_Release_Flag?: boolean;
  SLA_Breach_Flag?: boolean;
}

export interface FiltersState {
  startDate?: string;
  endDate?: string;
  vendor?: string;
  plant?: string;
  material?: string;
  poType?: string;
  matchStatus?: MatchStatus | "ALL";
  exceptionType?: string;
  blockReason?: string;
  responsibleTeam?: string;
}
