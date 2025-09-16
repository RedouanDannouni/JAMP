# Infrastructure as Code

## Overzicht
Deze folder bevat Infrastructure as Code (IaC) templates voor Azure deployment.

## Bestanden

### 1. ARM Templates
- `main.json` - Hoofd deployment template
- `parameters.json` - Environment-specifieke parameters

### 2. Bicep Files
- `main.bicep` - Moderne IaC syntax
- `modules/` - Herbruikbare modules

### 3. Terraform (Alternatief)
- `main.tf` - Terraform configuratie
- `variables.tf` - Input variabelen
- `outputs.tf` - Output waarden

## Azure Resources

### Geplande Resources
- Azure Functions App
- Azure SQL Database / PostgreSQL
- Azure Active Directory App Registration
- Application Insights
- Storage Account
- Key Vault

## Deployment
```bash
# ARM Template
az deployment group create \
  --resource-group ai-platform-rg \
  --template-file main.json \
  --parameters @parameters.json

# Bicep
az deployment group create \
  --resource-group ai-platform-rg \
  --template-file main.bicep
```

## Implementatie Status
- 🔄 Template placeholders aanwezig
- Resource definitie vereist
- Environment configuratie nodig