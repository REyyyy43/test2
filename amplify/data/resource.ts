import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================*/
const schema = a.schema({
  Tenant: a
    .model({
      name: a.string(),  // Nombre del inquilino
      adminId: a.string(),  // ID del administrador de este inquilino
    })
    .authorization((allow) => [
      allow.authenticated().to(['create']),  // Los usuarios autenticados pueden crear un inquilino
      allow.group('admin').to(['read']),   // Solo los administradores pueden leer el inquilino
    ]),

  User: a
    .model({
      username: a.string(),
      tenantId: a.string(),  // ID del inquilino al que pertenece el usuario
      role: a.string(), // Puede ser 'User', 'TenantAdmin', 'Administrator'
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read']),  // Los usuarios pueden crear y leer sus datos
      allow.group('tenantAdmin').to(['update']),  // Los administradores de inquilinos pueden actualizar usuarios dentro de su inquilino
      allow.group('admin').to(['delete']),  // Los administradores globales pueden eliminar usuarios
    ]),

  Message: a
    .model({
      content: a.string(),
      tenantId: a.string(),  // ID del inquilino al que pertenece el mensaje
      senderId: a.string(),  // ID del usuario que envió el mensaje
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read']),  // Los usuarios pueden crear y leer mensajes dentro de su inquilino
      allow.group('tenantAdmin').to(['create', 'read', 'update']),  // Los administradores de inquilinos pueden manejar mensajes dentro de su inquilino
      allow.group('admin').to(['create', 'read', 'delete']),  // Los administradores globales pueden gestionar los mensajes
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',  // Usar IAM para la autenticación
  },
});
