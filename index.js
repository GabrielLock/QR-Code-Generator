//Seleciona os elementos do DOM
const download = document.querySelector('.download');
const dark = document.querySelector('.dark');
const light = document.querySelector('.light');
const qrContainer = document.querySelector('#qr-code');
const qrText = document.querySelector('.qr-text');
const shareBtn = document.querySelector('.share-btn');
const sizes = document.querySelector('.sizes');

//Define os event listeners
dark.addEventListener('input', handleDarkColor);
light.addEventListener('input', handleLightColor);
qrText.addEventListener('input', handleQRText);
sizes.addEventListener('change', handleSize);
shareBtn.addEventListener('click', handleShare)

// Define as configurações padrão
const defaultUrl = 'https://youtube.com/@AsmrProg';
let colorLight = '#fff',
    colorDark = '#000',
    text = defaultUrl,
    size = 300;


//Função que ultiliza a cor escura
function handleDarkColor(e){
    colorDark = e.target.value;
    generateQRCode();
}

//Função que ultiliza a cor clara
function handleLightColor(e){
    colorLight = e.target.value;
    generateQRCode();
}

// Função que atualiza o texto do QR code
function handleQRText(e){
    const value = e.target.value;
    text = value;
    if (!value){
        text = defaultUrl;
    }
    generateQRCode();
}

//Função que gera o QR code com as configurações atuais
async function generateQRCode(){
    qrContainer.innerHTML = '';
    new QRCode('qr-code', {
        text,
        height: size,
        width: size,
        colorLight,
        colorDark,
    });
    download.href = await resolveDataUrl();
}

// Função que lida com o compartilhamento do QR code
async function handleShare(){
    setTimeout(async () =>{
        try{
            const base64url = await resolveDataUrl();
            const blob = await (await fetch(base64url)).blob();
            const file = new File([blob], 'QRCode.png', {
                type: blob.type,
            });
            await navigator.share({
                files: [file],
                title: text,
            });
        }catch (error){
            alert("Your browser doesn't support sharing.");
        }
    }, 100);
}

// Função que atualiza o tamanho do QR code
function handleSize(e){
    size = e.target.value;
    generateQRCode();
}

// Função que resolve o Data URL do QR code para download ou compartilhamento
function resolveDataUrl(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const img = document.querySelector('#qr-code img');
            if(img.currentSrc){
                resolve(img.currentSrc);
                return;
            }
            const canvas = document.querySelector('canvas');
            resolve(canvas.toDataURL());
        }, 50);
    })
}

//Gera o QR code inicial
generateQRCode();