const fs = require('fs');

 class Contenedor{

    constructor(NombreArchivo){
        this.ruta=`./archivos/${NombreArchivo}`
        this.encoding='utf-8'
    }

    // getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
    async getAll(){
        let array = await fs.promises.readFile(this.ruta, this.encoding)
        .then(JSON.parse)
        .catch(()=>{return []})

        return array
    }

    async getMaxId(){
        let items = await this.getAll()

        let id = 0
        items.forEach(item=> {
            if (item.id>id) {
                id=item.id;
            }
        });

        return id
    }

    // save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
    async save(object){

        const id =  await this.getMaxId() + 1
        let items = await this.getAll()
        object.id = id
        items.push(object);

        try{
            await fs.promises.writeFile(this.ruta, JSON.stringify(items));
        }
        catch(error){
            console.log(`Error al guardar archivo ${error}` )
        }

        return id;
    }

    // getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
    async getById(clave){
        let objeto
        const items = await this.getAll()
        
        items.forEach(element => {
            if (element.id==clave) {
                objeto = element
            } 
        });
        return objeto
    }

  
    // deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
    async deleteById(clave){
     
        let items = await fs.promises.readFile(this.ruta, this.encoding)
        .then(JSON.parse)
        .catch(()=>{return [] })
        
        let array=[];

        items.forEach(element => {
            if (element.id!=clave) {
                array.push(element);
            } 
        });

        await fs.promises.writeFile(this.ruta, JSON.stringify(array));

    }
    
    // deleteAll(): void - Elimina todos los objetos presentes en el archivo
    async deleteAll(){
        const items=[]
        await fs.promises.writeFile(this.ruta, JSON.stringify(items));
    }

    // update(Object):  Recibe un objeto, que busca en el archivo y actualiza .
    async update(clave, data){

        let items = await this.getAll()
        let array=[];

        items.forEach(element => {
            if(element.id == clave){
                element.title = data.title
                element.price = data.price
                element.thumbnail = data.thumbnail
            }
        });

        try{
            await fs.promises.writeFile(this.ruta, JSON.stringify(items));
        }
        catch(error){
            console.log(`Error al guardar archivo ${error}` )
        }
    }
}

module.exports= Contenedor