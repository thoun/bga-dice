interface Die {
    type: number | string;
    id: number;
    face: number;
}

interface DieType {
    facesCount: number;
    dieTypeClass: string;
    size?: number;

    /**
     * Allow to populate the main div of the die. You can set classes or dataset, if it's informations shared by all faces.
     * 
     * @param die the die informations
     * @param element the die main Div element
     */
    setupDieDiv?: (die: Die, element: HTMLDivElement) => void;

    /**
     * Allow to populate a face div of the die. You can set classes or dataset to show the correct die face.
     * 
     * @param die the die informations
     * @param element the die face Div element
     * @param face the face number (1-indexed)
     */
    setupFaceDiv?: (die: Die, element: HTMLDivElement, face: number) => void;
}