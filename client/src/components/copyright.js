import { Typography } from "@mui/material";

export function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © Books-Saga '}

      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
