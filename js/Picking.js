function handleMouseDown(event) 
{
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;


    var rect = event.target.getBoundingClientRect();
    if (rect.left <= lastMouseX && lastMouseX < rect.right && rect.top <= lastMouseY && lastMouseY < rect.bottom) 
    {
        //Tengo q llamar al drawscene 2 veces
        /*
        var renderbuffer = gl.createRenderbuffer();
        gl.bindBuffer(gl.RENDERBUFFER, renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,  gl.viewportWidth,gl.viewportHeight);

        var framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);*/

        var u_Clicked = gl.getUniformLocation(program, 'uOffscreen');

        gl.uniform1i(u_Clicked, 1);
        drawScene(1);

        var pixels = new Uint8Array(4);
        var pixelsUp = new Uint8Array(4);
        var pixelsDown = new Uint8Array(4);
        var pixelsLeft = new Uint8Array(4);
        var pixelsRight = new Uint8Array(4);
        
        var pixels = new Uint8Array(4);

        gl.readPixels(lastMouseX - rect.left, rect.bottom - lastMouseY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        if (pixels[0] > 0 || pixels[1] > 0 || pixels[2] > 0) 
        {
            gl.readPixels(lastMouseX - rect.left, rect.bottom - lastMouseY + 2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelsUp);
            gl.readPixels(lastMouseX - rect.left, rect.bottom - lastMouseY - 2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelsDown);
            gl.readPixels(lastMouseX - rect.left - 2, rect.bottom - lastMouseY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelsLeft);
            gl.readPixels(lastMouseX - rect.left + 2, rect.bottom - lastMouseY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelsRight);

            if ((pixelsUp[0] == pixelsDown[0] && pixelsUp[1] == pixelsDown[1] && pixelsUp[2] == pixelsDown[2]) || (pixelsLeft[0] == pixelsRight[0] && pixelsLeft[1] == pixelsRight[1] && pixelsLeft[2] == pixelsRight[2])) {


               var atom = GetAtom(pixels);
                if (atom.State == 'Active') 
                {
                    ////////////////////////////////////////////////////////////////////////////////////////
                    /////////////////////////////// TECLA CTRL PRESIONADA //////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////
                    //alert(atom.NumberAtom);
                    if (event.ctrlKey) 
                    {
                        //////////////////// EL ATOMO SELECCIONADO YA ESTABA SELECCIONADO ///////////////////////
                        if (atom.Seleccionado == true) 
                        {
                            ////////////////////////////////////////
                            //quitar el átomo 
                            var mul=(atom.PositionBSolid-1) * nColor;
                            for (var z = 0; z < nColor;) 
                            {
                                ColorTotal[atom.BloqueSolid-1][mul + z]   = atom.ColorRGB[0];
                                ColorTotal[atom.BloqueSolid-1][mul + z + 1]=atom.ColorRGB[1];
                                ColorTotal[atom.BloqueSolid-1][mul + z + 2]=atom.ColorRGB[2];
                                ColorTotal[atom.BloqueSolid-1][mul + z + 3]=atom.ColorRGB[3];
                                z = z + 4;
                            }
                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[atom.BloqueSolid-1]);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                            sphereVertexColorBuffer[atom.BloqueSolid-1].numItems = ColorTotal[atom.BloqueSolid-1].length / 4;
                            gl.bindBuffer(gl.ARRAY_BUFFER, null);    

                            atom.Seleccionado=false;

                            var posit = 0;
                            for (var k = 0; k < AtomosSeleccionados.length; k++) 
                            {
                                if (AtomosSeleccionados[k] == atom) 
                                {
                                    posit = k;
                                    break;
                                }

                            }
                            AtomosSeleccionados.splice(posit, 1);

                        }

                        /////////////////////////////////////////////////////////////////////////////////////////
                        //////////////////// EL ATOMO SELECCIONADO NO ESTABA SELECCIONADO ///////////////////////
                        else 
                        {
                            var mul=(atom.PositionBSolid-1) * nColor;
                            for (var z = 0; z < nColor;) 
                            {
                                ColorTotal[atom.BloqueSolid-1][mul + z]   = 0;  //va a ser el color de la selección
                                ColorTotal[atom.BloqueSolid-1][mul + z + 1]=1;
                                ColorTotal[atom.BloqueSolid-1][mul + z + 2]=0;
                                ColorTotal[atom.BloqueSolid-1][mul + z + 3]=1;
                                z = z + 4;
                            }
                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[atom.BloqueSolid-1]);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                            sphereVertexColorBuffer[atom.BloqueSolid-1].numItems = ColorTotal[atom.BloqueSolid-1].length / 4;
                            gl.bindBuffer(gl.ARRAY_BUFFER, null);    

                            atom.Seleccionado=true;
                            AtomosSeleccionados.push(atom);

                        }                        

                    }
                    //////////////////////////////////////////////////////////////////////////////////////////
                    //////////////////////////////// SIN PRESIONAR LA TECLA CTRL//////////////////////////////
                    //////////////////////////////////////////////////////////////////////////////////////////
                    else 
                    {
                        //alert("sin tecla crl");
                        //////////////////// EL ATOMO SELECCIONADO YA ESTABA SELECCIONADO ///////////////////////
                        //----------------------------------- poner todos en color normal ------------------------------------
                        if (atom.Seleccionado == true) 
                        {
                            var ArrCont=[];
                            //alert("ya estaba seleccionado")
                            /////////////////////////////////////////////////
                            for(var i=0; i < AtomosSeleccionados.length; i++ )
                            {
                                var atomTemp=AtomosSeleccionados[i];

                                var mul=( atomTemp.PositionBSolid - 1 ) * nColor;
                                for (var z = 0; z < nColor;) 
                                {
                                        ColorTotal[atomTemp.BloqueSolid-1][mul + z]   = atomTemp.ColorRGB[0];
                                        ColorTotal[atomTemp.BloqueSolid-1][mul + z + 1]=atomTemp.ColorRGB[1];
                                        ColorTotal[atomTemp.BloqueSolid-1][mul + z + 2]=atomTemp.ColorRGB[2];
                                        ColorTotal[atomTemp.BloqueSolid-1][mul + z + 3]=atomTemp.ColorRGB[3];
                                        z = z + 4;
                                }
                                atomTemp.Seleccionado=false;

                                var agregar=true;
                                for(var j=0; j < ArrCont.length; j++)
                                {
                                    if ((atomTemp.BloqueSolid-1)==ArrCont[j]) 
                                    {
                                        agregar=false;
                                        break;
                                    }
                                }
                                if (agregar==true) 
                                {
                                    ArrCont.push(atomTemp.BloqueSolid-1);
                                }      
                            }

                            for(var i=0; i < ArrCont.length; i++)
                            {
                                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[ArrCont[i]]);
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[ArrCont[i]]), gl.DYNAMIC_DRAW);
                                sphereVertexColorBuffer[ArrCont[i]].itemSize = 4;
                                sphereVertexColorBuffer[ArrCont[i]].numItems = ColorTotal[ArrCont[i]].length / 4;
                                gl.bindBuffer(gl.ARRAY_BUFFER, null);

                            }

                            AtomosSeleccionados = [];
                            /////////////////////////////////////////////////                                   

                        }

                        //////////////////// EL ATOMO SELECCIONADO NO ESTABA SELECCIONADO ///////////////////////
                        //------ poner todos en solid menos este
                        else 
                        {
                            var ArrCont=[];
                            for(var i=0; i < AtomosSeleccionados.length; i++ )
                            {
                                var atomTemp=AtomosSeleccionados[i];

                                var mul=( atomTemp.PositionBSolid - 1 ) * nColor;
                                for (var z = 0; z < nColor;) 
                                {
                                        ColorTotal[atomTemp.BloqueSolid-1][mul + z]   = atomTemp.ColorRGB[0];
                                        ColorTotal[atomTemp.BloqueSolid-1][mul + z + 1]=atomTemp.ColorRGB[1];
                                        ColorTotal[atomTemp.BloqueSolid-1][mul + z + 2]=atomTemp.ColorRGB[2];
                                        ColorTotal[atomTemp.BloqueSolid-1][mul + z + 3]=atomTemp.ColorRGB[3];
                                        z = z + 4;
                                }
                                atomTemp.Seleccionado=false;

                                var agregar=true;
                                for(var j=0; j < ArrCont.length; j++)
                                {
                                    if ((atomTemp.BloqueSolid-1)==ArrCont[j]) 
                                    {
                                        agregar=false;
                                        break;
                                    }
                                }
                                if (agregar==true) 
                                {
                                    ArrCont.push(atomTemp.BloqueSolid-1);
                                }     

                            }

                            for(var i=0; i < ArrCont.length; i++)
                            {
                                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[ArrCont[i]]);
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[ArrCont[i]]), gl.DYNAMIC_DRAW);
                                sphereVertexColorBuffer[ArrCont[i]].itemSize = 4;
                                sphereVertexColorBuffer[ArrCont[i]].numItems = ColorTotal[ArrCont[i]].length / 4;
                                gl.bindBuffer(gl.ARRAY_BUFFER, null);

                            }

                            AtomosSeleccionados = [];

                            var mul=(atom.PositionBSolid-1) * nColor;
                            for (var z = 0; z < nColor;) 
                            {
                                ColorTotal[atom.BloqueSolid-1][mul + z]   = 0;  //va a ser el color de la selección
                                ColorTotal[atom.BloqueSolid-1][mul + z + 1]=1;
                                ColorTotal[atom.BloqueSolid-1][mul + z + 2]=0;
                                ColorTotal[atom.BloqueSolid-1][mul + z + 3]=1;
                                z = z + 4;
                            }
                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[atom.BloqueSolid-1]);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                            sphereVertexColorBuffer[atom.BloqueSolid-1].numItems = ColorTotal[atom.BloqueSolid-1].length / 4;
                            gl.bindBuffer(gl.ARRAY_BUFFER, null);
                            //////////////////////////////////////////////////
                            AtomosSeleccionados.push(atom);
                            ///////////////////////////////////////////////////
                            atom.Seleccionado=true;               

                        }
                    }

                    document.getElementById('data').innerHTML = atom.NumberAtom + ' ' + atom.Element + ' ' + atom.NameAtom + ' ' + atom.X + ' ' + atom.Y + ' ' + atom.Z + ' ' + atom.Aminoacid + ' ' + atom.AminoNum;
                    //document.getElementById('data').innerHTML= "contador: "+contadores;


                }

            }

            //document.getElementById('data').innerHTML=(lastMouseX-rect.left)+' '+(rect.bottom-lastMouseY);

            //alert(GetNumAtom(pixels));

            //document.getElementById('data').innerHTML= 'number:' + number + ' '+ atom.NumberAtom+' '+atom.Element+' '+atom.NameAtom+' '+atom.X+' '+atom.Y+' '+atom.Z + ' readPixels:' + pixels[0] + ' ' + pixels[1] + ' ' + pixels[2];
            //alert(pixels[0] + ' ' + pixels[1] + ' ' + pixels[2]);
            //ColorTotal[0]=ColorTotalDiffuse[0];
            //alert(11);
        }

        gl.uniform1i(u_Clicked, 0);
        drawScene(0);

    }
}

function handleMouseUp(event) 
{
    mouseDown = false;
}

function handleMouseMove(event) 
{
    if (!mouseDown) 
    {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX
    var newRotationMatrix = mat4.create();
    mat4.identity(newRotationMatrix);
    mat4.rotate(newRotationMatrix, degToRad(deltaX / 5), [0, 1, 0]);

    var deltaY = newY - lastMouseY;
    mat4.rotate(newRotationMatrix, degToRad(deltaY / 5), [1, 0, 0]);

    mat4.multiply(newRotationMatrix, RotationMatrix, RotationMatrix);

    lastMouseX = newX
    lastMouseY = newY;
}


