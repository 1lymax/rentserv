import {useContext} from "react";
import {Context} from "../../index";

const useImportContext = (contextName) => {
	return useContext(Context[contextName])
};

export default useImportContext;