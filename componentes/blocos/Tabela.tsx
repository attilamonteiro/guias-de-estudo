"use client";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { BlocoTabela } from "@/conteudo/tipos";
import { misturar, paletaDe } from "@/tema/cores";
import { cartao, textoDeRotulo } from "@/tema/estilos";
import { Formatado } from "../base/Formatado";
import { TituloDoBloco } from "./TituloDoBloco";

const celula = { fontSize: "0.9rem", verticalAlign: "top", borderColor: "divider", px: "12px", py: "9px" } as const;

/** Tabela comparativa: a primeira coluna de cada linha funciona como cabeçalho da linha. */
export function Tabela({ bloco }: { bloco: BlocoTabela }) {
  return (
    <>
      <TituloDoBloco texto={bloco.titulo} />
      <TableContainer sx={{ ...cartao, overflowX: "auto" }}>
        <Table sx={{ minWidth: 520 }}>
          <TableHead>
            <TableRow>
              {bloco.colunas.map((coluna, i) => (
                <TableCell
                  key={i}
                  sx={{
                    ...celula,
                    ...textoDeRotulo,
                    fontSize: "0.74rem",
                    letterSpacing: "0.05em",
                    fontWeight: 500,
                    bgcolor: "tons.superficie2",
                  }}
                >
                  <Formatado texto={coluna} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ "& tr:last-child > *": { borderBottom: 0 } }}>
            {bloco.linhas.map((linha, i) => (
              <TableRow key={i}>
                {linha.map((texto, j) =>
                  j === 0 ? (
                    <TableCell
                      key={j}
                      component="th"
                      scope="row"
                      sx={{
                        ...celula,
                        fontWeight: 600,
                        width: "22%",
                        bgcolor: (tema) =>
                          misturar(paletaDe(tema).tons.superficie2, 45, paletaDe(tema).background.paper),
                      }}
                    >
                      <Formatado texto={texto} />
                    </TableCell>
                  ) : (
                    <TableCell key={j} sx={{ ...celula, minWidth: 150 }}>
                      <Formatado texto={texto} />
                    </TableCell>
                  ),
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {bloco.nota && (
        <Typography sx={{ fontSize: "0.88rem", color: "text.secondary", mt: 1, maxWidth: "72ch" }}>
          <Formatado texto={bloco.nota} />
        </Typography>
      )}
    </>
  );
}
