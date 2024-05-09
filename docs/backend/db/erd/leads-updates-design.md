```mermaid
    erDiagram
  LEADS ||--|{ LEADS_ADVISOR: "1"
  LEADS_ADVISOR |{--|| CONNECT_ADVISOR: "1"
  LEADS_COMMENTS ||--|{ COMMENTS: "1"
  LEADS ||--|{ LEADS_COMMENTS: "1"
  LEADS_ADVISOR ||--|{ LEADS_ADVISOR_COMMENTS: "1"
  LEADS_ADVISOR_COMMENTS ||--|{ COMMENTS: "1"
  LEADS {
    id string
    status string
    created_at datetime
    updated_at datetime
    created_by string
    updated_by string
  }
  CONNECT_ADVISOR {
    id string
  }
  LEADS_ADVISOR {
    id string
    lead_id string
    connect_advisor_id string
  }
  LEADS_COMMENTS {
    id string
    lead_id string
    comments_id string
  }
  COMMENTS {
    id string
    comment string
    is_private boolean
    created_at datetime
    updated_at datetime
    created_by string
    updated_by string
  }
  LEADS_ADVISOR_COMMENTS {
    id string
    lead_id string
    comments_id string
    connect_advisor_id string
  }
```
