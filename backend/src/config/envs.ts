import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars{
    PORT:number;
    DATABASE_URL: string;
} 

const envsSchema = joi.object({
    PORT:joi.number().required(),
    //DATABASE_URL:joi.string().required(),
}) 
.unknown(true);

const {error, value} = envsSchema.validate(process.env); 

//console.log({error});
//console.log({envVars});
 
if(error){
    throw new Error(`Error de validacion en la configuracion: ${error.message}`);
}  

const envsVars:EnvVars = value;

export const envs = {
    port: envsVars.PORT,
    databaseUrl:envsVars.DATABASE_URL,
}