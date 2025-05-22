# ee-medicine-app



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type     | Default     |
| ------------- | -------------- | ----------- | -------- | ----------- |
| `ambulanceId` | `ambulance-id` |             | `string` | `undefined` |
| `apiBase`     | `api-base`     |             | `string` | `undefined` |
| `basePath`    | `base-path`    |             | `string` | `''`        |


## Dependencies

### Depends on

- [ee-inventory-editor](../ee-inventory-editor)
- [ee-order-editor](../ee-order-editor)
- [ee-medicine-inventory](../ee-medicine-inventory)

### Graph
```mermaid
graph TD;
  ee-medicine-app --> ee-inventory-editor
  ee-medicine-app --> ee-order-editor
  ee-medicine-app --> ee-medicine-inventory
  style ee-medicine-app fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
