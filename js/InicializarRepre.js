//esta es la inicialización o cambio de representación de toda la molécula

function InitBufSB()
{

    initBuffersSpheresSB();

    initBuffersBonds(true);

    initBufBndSkele(false);

    AtomosSeleccionados=molecule.LstAtoms;

}

function InitBufCPK()
{

    initBuffersSpheresCPK();

    initBuffersBonds(false);

    initBufBndSkele(false);

    AtomosSeleccionados=molecule.LstAtoms;

}

function InitBufBonds()
{

    initBuffersBonds(true);

    initBufBndSkele(false);

    AtomosSeleccionados=molecule.LstAtoms;
}


function InitBufSkeleton()
{

    initBuffersBonds(false);

    initBufBndSkele(true);

    //Inicializar los CA de todos los átomos de la molécula

    AtomosSeleccionados=molecule.LstAtoms;

}

