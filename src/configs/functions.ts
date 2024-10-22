const rand = ()=> {
    return Math.random().toString(36).substr(2);
};

export function generateToken(size=1){
    var token = ""
    for (var i = 0; i < size; i++) {
        token += rand();
    }
    return token;
};