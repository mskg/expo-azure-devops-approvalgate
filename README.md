# expo-azure-devops-approvalgate

Building expo projects using the default service can take quite a while. This project contains a VSTS deployment gate running on AWS that waits for the build webhook to be triggered.

## Deploy
1. `yarn`
2. `WEBHOOK_SECRET=SECRET yarn run deploy`

## Configure Expo

`expo webhooks:set --url <URL> --event build --secret <SECRET>`

## Configure DevOps

1. Create generic *Service Connection*
1. *API Url* <URL>/dev/register
1. Add a gate using the service connection
1. Headers
    ```
    {
        "Content-Type":"application/json", 
        "x-api-key": "<YOUR API KEY>"
    }
    ```
1. Body
    ```
    {
        "PlanUrl": "$(system.CollectionUri)", 
        "ProjectId": "$(system.TeamProjectId)", 
        "HubName": "$(system.HostType)", 
        "PlanId": "$(system.PlanId)", 
        "JobId": "$(system.JobId)", 
        "TimelineId": "$(system.TimelineId)", 
        "TaskInstanceId": "$(system.TaskInstanceId)", 
        "AuthToken": "$(system.AccessToken)",
        "BuildUrl": "<URL FROM EXPO>"
    }
    ```
