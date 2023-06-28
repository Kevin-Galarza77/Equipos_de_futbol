export interface estudiante {
  id?: string,
  nombres: string,
  apellidos: string,
  notas: {
    nota_1: number,
    nota_2: number,
    nota_3: number,
    nota_4: number,
    nota_5: number,
    total: number
  }
}

export interface soccerTeam {
  id?: string,
  name: string,
  country: string,
  year_fundation: string,
  name_stadium: string,
  tittles: number,
  shieldTeam: any
}
