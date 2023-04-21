const messages = {
  team: {
    error: {
      emptyName: "El nombre del equipo no puede estar vacío",
      longName: "El nombre del equipo debe tener máximo 40 caracteres",
      duplicateName: "El nombre del equipo ya existe",
      duplicateTeamMember: "El usuario ya pertenece a este equipo",
      teamDoesNotExist: "El equipo no existe",
      teamMemberDoesNotExist: "El usuario no pertenece a este equipo",
    },
    success: {
      teamCreated: "Equipo creado correctamente",
      teamDeleted: "Equipo eliminado correctamente",
      teamActivated: "Equipo activado correctamente",
      teamMemberAdded: "¡Te has unido al equipo con éxito!",
      teamMemberRemoved: "Has abandonado al equipo con éxito",
    },
  },
  actionables: {
    error: {
      actionableNotRegistered: "El accionable no ha sido registrado en Jira",
    },
    success: {
      statusActionableUpdated:
        "Estado del accionable actualizado correctamente",
    },
  },
  validation: {
    isEmpty: "No existe un registro con el id proporcionado",
    isMandatory: "El campo es obligatorio",
    mustBeString: "El campo debe ser una cadena de caracteres",
    mustBeNumber: "El campo debe ser un número",
    mustBeInteger: "El campo debe ser un número entero",
    mustBeDate: "El campo debe ser una fecha",
    mustBeBoolean: "El campo debe ser un booleano",
    mustBeArray: "El campo debe ser un array",
    mustBeEnum: (variations) =>
      `El campo debe ser uno de los siguientes valores: ${variations}`,
    mustBeLongerThan: (n) => `El campo debe tener más de ${n} caracteres`,
    mustHaveAtLeast: (n) => `El campo debe tener al menos ${n} elementos`,
    mustBeShorterThan: (n) => `El campo debe tener menos de ${n} caracteres`,
    mustBeAfter: (date) => `El campo debe ser posterior a ${date}`,
  },
};

module.exports = messages;
