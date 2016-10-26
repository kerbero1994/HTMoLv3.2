//esta es la inicialización o cambio de representación de toda la molécula

function InitBufSB()
{
    cleanMemory();

    initBuffersSpheresSB();

    initBuffersBonds(true);

    initBufBndSkele(false);

    AtomosSeleccionados=molecule.LstAtoms;

}

function InitBufCPK()
{
    cleanMemory();

    initBuffersSpheresCPK();

    initBuffersBonds(false);

    initBufBndSkele(false);

    AtomosSeleccionados=molecule.LstAtoms;

}

function InitBufBonds()
{
    cleanMemory();

    initBuffersBonds(true);

    initBufBndSkele(false);

    AtomosSeleccionados=molecule.LstAtoms;
}


function InitBufSkeleton()
{
    cleanMemory();

    initBuffersBonds(false);

    initBufBndSkele(true);

    //Inicializar los CA de todos los átomos de la molécula

    AtomosSeleccionados=molecule.LstAtoms;

}

