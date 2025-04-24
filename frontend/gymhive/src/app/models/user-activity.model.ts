export interface UserActivity {
    activityId?: string;
    userId:     string;
    userEmail:  string;
    timestamp:  string;        
    action:     'LOGIN' | 'LOGOUT';
  }