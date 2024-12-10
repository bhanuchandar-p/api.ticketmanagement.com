export const jwtConfig = {
    secret: process.env.JWT_SECRET as string,
    exp_in: 60*60*24*7
}

export const jwtRefreshConfig = {
    secret: process.env.JWT_SECRET as string,
    exp_in: 60*60*24*30
}

export const jwtResetConfig = {
    secret: process.env.JWT_SECRET as string,
    exp_in: 60*60*10
}