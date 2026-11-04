import Typography from "@mui/material/Typography";
import { Formatado } from "../base/Formatado";

export function TituloDoBloco({ texto }: { texto?: string }) {
  if (!texto) return null;
  return (
    <Typography component="h4" variant="h4" sx={{ m: "18px 0 8px" }}>
      <Formatado texto={texto} />
    </Typography>
  );
}
