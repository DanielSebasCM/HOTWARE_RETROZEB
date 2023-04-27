# HOTWARE_RETROZEB

## **Integrantes**

| Nombre                           | Matrícula | Perfil Personal                                     |
| -------------------------------- | --------- | --------------------------------------------------- |
| Damariz Licea Carrisoza          | A01369045 | [DamarizLicea](https://github.com/DamarizLicea)     |
| Sergio Garnica González          | A01704025 | [sgarnica1](https://github.com/sgarnica1)           |
| Daniel Emilio Fuentes Portaluppi | A01708302 | [danfupo03](https://github.com/danfupo03)           |
| Daniel Sebastián Cajas Morales   | A01708637 | [DanielSebasCM](https://github.com/DanielSebasCM)   |
| Leslie del Carmen Sánchez Reyes  | A01708987 | [leshcsr](https://github.com/leshcsr)               |
| Ricardo Adolfo Fernández         | A01704813 | [lCDSLl-Richard](https://github.com/lCDSLl-Richard) |

---

<br>
<br>

## **Manual de despliegue**

| Nombre       | Matricula                |                  |                |
| ------------ | ------------------------ | ---------------- | -------------- |
| Organismo    | Hotware                  |                  |                |
| Proyecto     | RetroZeb                 |                  |                |
| Documento    | Manual de Despliegue AWS |                  |                |
| Autor        | Equipo Hotware           |                  |                |
| Versión      | 01                       | Fecha de versión | 27 / 04 / 2023 |
| Aprobado por |                          | Fecha Aprobación |                |

<br>
<br>

## **Detalles del servidor**

| Nombre                    | Perfil Personal           |
| ------------------------- | ------------------------- |
| Proveedor Servicios Cloud | Amazon Web Services (AWS) |
| Servicio                  | Amazon EC2                |
| Memoria RAM               | 1 GB                      |
| Ambiente de Ejecución     | Ubuntu 22.04.2            |
| Servidor Web              | Nginx 1.18                |
| Base de Datos             | MariaDB-Server 10.6.12    |
| Entorno de ejecución      | Node.js 18.16             |

  <br >

## **Índice**

| General                |
| ---------------------- |
| Objetivo               |
| Alcance                |
| Diagrama de Despliegue |

| Pasos de instalación                           | Pasos adicionales        |
| ---------------------------------------------- | ------------------------ |
| **Paso 1** - Nginx                             | Instalar Nginx           |
|                                                | Comandos útiles de Nginx |
| **Paso 2** - Instalar Node & NPM               |                          |
| **Paso 3** - PM2                               | Comandos de PM2          |
| **Paso 4** - Instalar MariaDB                  |                          |
| **Paso 5** - Instalar la aplicación            |                          |
| **Paso 6** - Montar la base de datos           |                          |
| **Paso 7** - Configuración de bloques de Nginx |                          |
| **Paso 8** - Instalación del certificado SSL   |

<br>
<br>

## Objetivo

El objetivo de este manual de despliegue es proporcionar un conjunto detallado de instrucciones paso a paso sobre cómo implementar, configurar y poner en funcionamiento el sistema en un entorno operativo específico.

El manual de despliegue proporciona información detallada sobre los requisitos del sistema, la configuración e instalación de software, la configuración de la red, la integración de bases de datos, y otras tareas técnicas necesarias para que el sistema funcione correctamente.

## Alcance

Este manual de despliegue está dirigido a los desarrolladores, administradores de sistemas y otros profesionales de TI involucrados en el despliegue del sistema.

## Diagrama de Despliegue

En el diagrama de despliegue se muestra representación visual de cómo se distribuyen los componentes de nuestro sistema en diferentes nodos físicos y/o virtuales.

<br>

---

<br>

## **Pasos de intalación**

### Paso 1 - Nginx

Para este sistema se utiliza Nginx como un reverse-proxy, es decir, recibe las peticiones de los distintos clientes, y las redirige al servicio correspondiente de la aplicación.
Instalar Nginx

#### Correr los siguientes comandos, aceptando la instalación (Y):

```bash
sudo apt update
sudo apt install nginx
```

Para verificar que esté funcionando:

```bash
systemctl status nginx
```

Se debería de ver un mensaje que contiene

```bash
Active: active (running)
```

​
En este punto, al navegar desde un browser a [http://<ip_del_servidor>](http://<ip_del_servidor>), se debería de ver la página principal de nginx
​
Comandos útiles de Nginx
bash:

```bash
sudo systemctl stop nginx # Detener nginx
sudo systemctl start nginx # Iniciar nginx, si está detenido
sudo systemctl restart nginx # Detener y reiniciar nginx
sudo systemctl reload nginx # Recargar nginx, para aplicar cambios en configuración
```
