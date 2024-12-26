exports.handler = async (event) => {
    const { role, tenantId } = event.identity.claims;
  
    if (event.info.fieldName === 'createMessage' && role !== 'TenantAdmin') {
      throw new Error('No tienes permisos para enviar mensajes.');
    }
  
    if (event.info.fieldName.startsWith('manageUsers') && role !== 'TenantAdmin') {
      throw new Error('No tienes permisos para gestionar usuarios.');
    }
  
    return event;
  };
  