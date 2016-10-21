//var buttonOp;
function R_Cpk() {
    return function(event) {
        CambiarRepresentacion("Cpk");
    }
}

function R_SB() {
    return function(event) {
        CambiarRepresentacion("SB");
    }
}

function R_B() {
    return function(event) {
        CambiarRepresentacion("B");
    }
}

function SetView(mol, name){
    return function(event) {
         var newRotationMatrix = mat4.create();
        mat4.identity(newRotationMatrix);
        if (name.name=='F') 
        {
            mat4.rotate(newRotationMatrix, degToRad(0), [0, 1, 0]); //vista frontal
        }
        else if(name.name=='L')
        {
            mat4.rotate(newRotationMatrix, degToRad(90), [0, 1, 0]); //vista izquierda
        }
        else if(name.name=='R')
        {
            mat4.rotate(newRotationMatrix, degToRad(270), [0, 1, 0]); //vista derecha
        }
        else if(name.name=='U')
        {
            mat4.rotate(newRotationMatrix, degToRad(90), [1, 0, 0]); //vista de arriba
        }
        else if(name.name=='D')
        {
            mat4.rotate(newRotationMatrix, degToRad(270), [1, 0, 0]); //vista de abajo
        }
        else //back
        {
            mat4.rotate(newRotationMatrix, degToRad(180), [0, 1, 0]); //vista de atras
        }

        mat4.identity(RotationMatrix);
         mat4.multiply(newRotationMatrix, RotationMatrix, RotationMatrix);
    }
}

function ByAmino(mol, name) {
    return function(event) {
        AtomosSeleccionados = [];
        for (var i = 0; i < molecule.LstChain.length; i++) {
            for (var j = 0; j < molecule.LstChain[i].LstAminoAcid.length; j++) {
                if (molecule.LstChain[i].LstAminoAcid[j].Name == name) {
                    for (var k = 0; k < molecule.LstChain[i].LstAminoAcid[j].LstAtoms.length; k++) {
                        AtomosSeleccionados.push(molecule.LstChain[i].LstAminoAcid[j].LstAtoms[k]);
                    }
                }
            }
        }
        ProcesarSeleccion();

    }

}

function ByAtoms(mol, element) {
    return function(event) {
        AtomosSeleccionados = [];
        for (var i = 0; i < molecule.LstAtoms.length; i++) {
            //alert(molecule.LstAtoms[i].Element);
            if (element == molecule.LstAtoms[i].Element) {
                if (molecule.LstAtoms[i].State == 'Active') {
                    AtomosSeleccionados.push(molecule.LstAtoms[i]);
                }

            }
        }
        ProcesarSeleccion();


    }
}

function ByColor(mol, color) {
    return function(event) {
        AtomosSeleccionados = [];
        for (var i = 0; i < molecule.LstAtoms.length; i++) {
            //alert(molecule.LstAtoms[i].Element);
            if (color == molecule.LstAtoms[i].ColorName) {
                if (molecule.LstAtoms[i].State == 'Active') {
                    AtomosSeleccionados.push(molecule.LstAtoms[i]);
                }

            }
        }
        ProcesarSeleccion();
    }
}

function ProcesarSeleccion() 
{
    console.time("procesarSeleccion");
    var ArrCont=[];
    for (var t = 0; t < AtomosSeleccionados.length; t++) 
    {
        var atom = AtomosSeleccionados[t];
        if (atom.Seleccionado == false) 
        {
            //
            atom.Seleccionado = true;
            haySeleccionado = true;
            var mul=(atom.PositionBSolid-1) * nColor;
            for (var z = 0; z < nColor;) 
            {
                ColorTotal[atom.BloqueSolid-1][mul + z]   = 0;  //va a ser el color de la selección
                ColorTotal[atom.BloqueSolid-1][mul + z + 1]=1;
                ColorTotal[atom.BloqueSolid-1][mul + z + 2]=0;
                ColorTotal[atom.BloqueSolid-1][mul + z + 3]=1;                                
                 z = z + 4;
            }

            var agregar=true;
            for(var i=0; i < ArrCont.length; i++)
            {
                if ((atom.BloqueSolid-1)==ArrCont[i]) 
                {
                    agregar=false;
                    break;
                }
            }
            if (agregar==true) 
            {
                ArrCont.push(atom.BloqueSolid-1);
            }                             

        } 
        else 
        {
            //No hacer nada xq ya está seleccionado

        }        
    }

        for(var i=0; i < ArrCont.length; i++)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[i]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[i]), gl.DYNAMIC_DRAW);
            sphereVertexColorBuffer[i].numItems = ColorTotal[i].length / 4;
            gl.bindBuffer(gl.ARRAY_BUFFER, null);   
            
        }
    

    console.timeEnd("procesarSeleccion");

}


function ProcesarCadena(index, button) {
    return function(event) {
        if (molecule.LstChain[index].State == 'Inactive') {
            button.style.color = ' #ffffff ';
            molecule.LstChain[index].State = 'Active'

            var pos = index + 1;

            for (var k = 0; k < ArrayIndx.length; k++) {
                if (pos == ArrayIndx[k]) {
                    ArrayIndx.splice(k, 1);
                }

            }
            ArrayIndx.push(0);

            var u_Array = gl.getUniformLocation(program, 'uIntArray');

            gl.uniform1fv(u_Array, ArrayIndx);

            ArrayIndx.pop();


            for (var i = 0; i < molecule.LstChain[index].LstAminoAcid.length; i++) {
                for (var j = 0; j < molecule.LstChain[index].LstAminoAcid[i].LstAtoms.length; j++) {
                    var at = molecule.LstChain[index].LstAminoAcid[i].LstAtoms[j];
                    //voy a checar cada uno para ver si está en wire o en solid
                    //alert(ColorTotal[at.BloqueSolid-1]);
                    //alert(at.NameAtom);
                    at.State = 'Active';
                   
                }
            }

        } else {
            button.style.color = ' rgb(255,0,0) ';
            molecule.LstChain[index].State = 'Inactive'


            ArrayIndx.push(index + 1);

            //alert(ArrayIndx);

            var u_Array = gl.getUniformLocation(program, 'uIntArray');

            gl.uniform1fv(u_Array, ArrayIndx);

            for (var i = 0; i < molecule.LstChain[index].LstAminoAcid.length; i++) {
                for (var j = 0; j < molecule.LstChain[index].LstAminoAcid[i].LstAtoms.length; j++) {
                    var at = molecule.LstChain[index].LstAminoAcid[i].LstAtoms[j];
                    //voy a checar cada uno para ver si está en wire o en solid
                    //alert(ColorTotal[at.BloqueSolid-1]);
                    //alert(at.NameAtom);
                    at.State = 'Inactive';
                    
                }

            }
        }

        //alert("entra ProcesarCadena:"+index);
    }
}


function CambiarRepresentacion(Repre) //Representacion es en lo que se va a cambiar
{
    if (Repre == 'Cpk') {
        for (var o in AtomosSeleccionados) //son los objetos seleccionados 
        {
            //primero encontrar con el átomo "o" la posición en el bloque y en el array, y hacerle un splice ahí
            //
            var ato = AtomosSeleccionados[o];

            var mul=( ato.PositionBSolid - 1 ) * nVertices;

            if (ato.NameAtom == 'H') {
                //alert("H");
                //ingresar los nuevos vértices                
                for (var z = 0; z < nVertices;) //vertices para esfera de 16 latitudes y longitudes
                {
                    vertexPositionData[ato.BloqueSolid - 1][mul + z]     = verArrayH[z] + ato.X - Cx; //estoy quitando y al mismo tiempo agregando, por lo que se queda
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 1] = verArrayH[z + 1] + ato.Y - Cy; //la misma longitud en cada operación
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 2] = verArrayH[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else if (ato.NameAtom == 'C') {
                //alert("C");
                for (var z = 0; z < nVertices;) {
                    vertexPositionData[ato.BloqueSolid - 1][mul + z] = verArrayC_PB_TI_CA[z] + ato.X - Cx;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 1] = verArrayC_PB_TI_CA[z + 1] + ato.Y - Cy;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 2] = verArrayC_PB_TI_CA[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

                //alert("saleC"); 
            } else if (ato.NameAtom == 'PB') {
                //alert("PB");
                //ingresar los nuevos vértices
                for (var z = 0; z < nVertices;) {
                    vertexPositionData[ato.BloqueSolid - 1][mul + z] = verArrayC_PB_TI_CA[z] + ato.X - Cx;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 1] = verArrayC_PB_TI_CA[z + 1] + ato.Y - Cy;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 2] = verArrayC_PB_TI_CA[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else if (ato.NameAtom == 'TI') {
                //alert("TI");
                //ingresar los nuevos vértices
                for (var z = 0; z < nVertices;) {
                    vertexPositionData[ato.BloqueSolid - 1][mul + z] = verArrayC_PB_TI_CA[z] + ato.X - Cx;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 1] = verArrayC_PB_TI_CA[z + 1] + ato.Y - Cy;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 2] = verArrayC_PB_TI_CA[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else if (ato.NameAtom == 'CA') {
                //alert("CA");
                //ingresar los nuevos vértices
                for (var z = 0; z < nVertices;) {
                    vertexPositionData[ato.BloqueSolid - 1][mul + z] = verArrayC_PB_TI_CA[z] + ato.X - Cx;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 1] = verArrayC_PB_TI_CA[z + 1] + ato.Y - Cy;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 2] = verArrayC_PB_TI_CA[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else if (ato.NameAtom == 'N') {
                //alert("N");
                //ingresar los nuevos vértices
                for (var z = 0; z < nVertices;) //vertices para esfera de 16 latitudes y longitudes
                {
                    vertexPositionData[ato.BloqueSolid - 1][mul + z] = verArrayN[z] + ato.X - Cx;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 1] = verArrayN[z + 1] + ato.Y - Cy;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 2] = verArrayN[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else if (ato.NameAtom == 'O') {
                //alert("O");
                //ingresar los nuevos vértices
                for (var z = 0; z < nVertices;) //vertices para esfera de 16 latitudes y longitudes
                {
                    vertexPositionData[ato.BloqueSolid - 1][mul + z] = verArrayO[z] + ato.X - Cx;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 1] = verArrayO[z + 1] + ato.Y - Cy;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 2] = verArrayO[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

                //alert("ssss");  

            } else if (ato.NameAtom == 'S') {
                //alert("S");
                //ingresar los nuevos vértices
                for (var z = 0; z < nVertices;) //vertices para esfera de 16 latitudes y longitudes
                {
                    vertexPositionData[ato.BloqueSolid - 1][mul + z] = verArrayS[z] + ato.X - Cx;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 1] = verArrayS[z + 1] + ato.Y - Cy;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 2] = verArrayS[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else if (ato.NameAtom == 'P') {
                //alert("P");
                //ingresar los nuevos vértices
                for (var z = 0; z < nVertices;) //vertices para esfera de 16 latitudes y longitudes
                {
                    vertexPositionData[ato.BloqueSolid - 1][mul + z] = verArrayP[z] + ato.X - Cx;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 1] = verArrayP[z + 1] + ato.Y - Cy;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 2] = verArrayP[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

            } else /////////// DEFAULT
            {
                //alert("entra aqui");
                //ingresar los nuevos vértices
                for (var z = 0; z < nVertices;) //vertices para esfera de 16 latitudes y longitudes
                {
                    vertexPositionData[ato.BloqueSolid - 1][mul + z] = verArrayDefault[z] + ato.X - Cx;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 1] = verArrayDefault[z + 1] + ato.Y - Cy;
                    vertexPositionData[ato.BloqueSolid - 1][mul + z + 2] = verArrayDefault[z + 2] + ato.Z - Cz;

                    z = z + 3;
                }

                //alert("eyyyyyyyyyytra aqui");
            }
            ato.Representation = "CPK";

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[ato.BloqueSolid - 1]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[ato.BloqueSolid - 1]), gl.DYNAMIC_DRAW);
            sphereVertexPositionBuffer[ato.BloqueSolid - 1].itemSize = 3;
            sphereVertexPositionBuffer[ato.BloqueSolid - 1].numItems = vertexPositionData[ato.BloqueSolid - 1].length / 3;
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            //gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[bloques]);
            //gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(wirePositionData[bloques]));   

            //gl.bindBuffer(gl.ARRAY_BUFFER, sphereDifufusePositionBuffer[bloques]);
            //gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(vertexPositionDataD[bloques]));   

        }
    } else if (Repre == 'SB') {
        //alert(88);
        for (var o in AtomosSeleccionados) //son los objetos seleccionados 
        {
            //primero encontrar con el átomo "o" la posición en el bloque y en el array, y hacerle un splice ahí
            //
            var ato = AtomosSeleccionados[o];

            var mul=( ato.PositionBSolid - 1 ) * nVertices;

            for (var z = 0; z < nVertices;) //vertices para esfera de 16 latitudes y longitudes
            {
                vertexPositionData[ato.BloqueSolid - 1][mul + z] = verArray[z] + ato.X - Cx;
                vertexPositionData[ato.BloqueSolid - 1][mul + z + 1] = verArray[z + 1] + ato.Y - Cy;
                vertexPositionData[ato.BloqueSolid - 1][mul + z + 2] = verArray[z + 2] + ato.Z - Cz;

                z = z + 3;
            }



            ato.Representation = "SB";

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[ato.BloqueSolid - 1]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[ato.BloqueSolid - 1]), gl.DYNAMIC_DRAW);
            sphereVertexPositionBuffer[ato.BloqueSolid - 1].itemSize = 3;
            sphereVertexPositionBuffer[ato.BloqueSolid - 1].numItems = vertexPositionData[ato.BloqueSolid - 1].length / 3;
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            
        }

    } else if (Repre == 'B') {



    } else {

    }
}