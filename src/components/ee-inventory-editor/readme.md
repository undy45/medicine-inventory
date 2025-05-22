# ee-inventory-editor



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type     | Default     |
| ------------- | -------------- | ----------- | -------- | ----------- |
| `ambulanceId` | `ambulance-id` |             | `string` | `undefined` |
| `apiBase`     | `api-base`     |             | `string` | `undefined` |
| `entryId`     | `entry-id`     |             | `string` | `undefined` |


## Events

| Event                  | Description | Type                  |
| ---------------------- | ----------- | --------------------- |
| `create-order-clicked` |             | `CustomEvent<string>` |
| `editor-closed`        |             | `CustomEvent<string>` |


## Dependencies

### Used by

 - [ee-medicine-app](../ee-medicine-app)

### Graph
```mermaid
graph TD;
  ee-medicine-app --> ee-inventory-editor
  style ee-inventory-editor fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
