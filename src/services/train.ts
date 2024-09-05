import Axios from "axios";
import FormData from "form-data";

export const train = async (input: string, output: string): Promise<boolean> => {
    var body = new FormData();
    body.append("entrada_perg", input);
    body.append("entrada_resp", output);
    var response = await Axios({
      method: "post",
      url: "https://homyapps.com.br/henry-bot/treinar.php",
      data: body,
      headers: { "Content-Type": "multipart/form-data" },
    })
  
    return response?.data?.includes("Salvo com sucesso")
  }