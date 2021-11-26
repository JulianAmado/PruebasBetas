import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { Empleado } from '../models';
import { EmpleadoRepository } from '../repositories';
import { Llaves } from '../config/llaves';
const generador = require("password-generator")
const crypto25 = require("crypto-js");
const jwt = require("jsonwebtoken");


@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  EmpleadoRepository: any;
  identificarEmpleado: any;
  constructor(
    @repository(EmpleadoRepository)
    public empleadoRepository : EmpleadoRepository 
  ) {}

  /*
   * Add service methods here
   */
GenerarClave(){
  let clave = generador(8, false);
  return clave;                  

}

CifrarClave(clave: string){
  let claveCifrada = crypto25.MDS(clave).toString();
  return claveCifrada

}
IdentificarEmpleado(usuario: string, clave: string) {
  try {
    let p = this.empleadoRepository.findOne({where:{email: usuario, clave: clave}});
    if(p){
      return p;
    }
    return false;
  } 
  catch{ 
    return false;
  }
}

GenerarTokenJWT(empleado: Empleado){
  let token = jwt.sign({
    data:{
      id: empleado.id,
      correo: empleado.email,
      nombre: empleado.nombres + " " + empleado.apellidos
    }

  },
  Llaves.claveJWT);
  return token;

}

ValidarTokenJWT(token: string){
  try{
    let datos = jwt.verify(token, Llaves.claveJWT);
    return datos;
  }
  catch{
    return false;
  }
}

   
Usuarioyclave(Empleado: Empleado, clave: string){
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
      to: Empleado.email, // Change to your recipient
      from: 'neylavillamizar@yahoo.es', // Change to your verified sender
      subject: 'Creación de cuenta, CasaBeta',
      text: 'Hola, '+Empleado.nombres+" "+Empleado.apellidos+' ahora eres empleado de la Casa Beta, tu usuario es: '+Empleado.email+" y tu clave es: "+clave,
      html: '<strong>and easy to do anywhere, even with Node.js and CasaBeta</strong>',
      }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error: string) => {
        console.error(error)
})}

}