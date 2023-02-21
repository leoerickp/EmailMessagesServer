export const EnvConfiguration = () => ({
    environment: process.env.STATE || 'prod',
    mongodb: process.env.MONGODB,
    port: +process.env.PORT || 3000,
    defaultLimit: +process.env.DEFAULT_LIMIT || 10,
    jwtSecret: process.env.JWT_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
})