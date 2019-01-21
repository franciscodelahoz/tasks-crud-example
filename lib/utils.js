exports.toBool = (value) => {
	if (value == true  || value == 1 || value == 'true'  || value == '1' || value == 'True' ) { return true;  }
	if (value == false || value == 0 || value == 'false' || value == '0' || value == 'False') { return false; }
};
