import { useCallback, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useAuth } from "src/hooks/use-auth";
import NextLink from "next/link";
import * as Yup from "yup";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";

import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Popover,
  SvgIcon,
} from "@mui/material";
export const TransactionPopover = (props) => {
  const { onClose, open } = props;
  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      email: "demo@devias.io",
      password: "Password123!",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signIn(values.email, values.password);
        router.push("/");
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <Popover
      anchorReference="anchorPosition"
      anchorPosition={{ top: 300, left: 400 }}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={onClose}
      open={open}
    >
      <Box
        sx={{
          width: 1000,
          height: 600,
          px: 3,
          py: 3,
        }}
      >
        <div>
          <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mx: 3, my: 3 }}>
            <Typography variant="h4">New Transaction</Typography>
            <div>
              <Button
                startIcon={
                  <SvgIcon fontSize="large">
                    <XCircleIcon />
                  </SvgIcon>
                }
                onClick={onClose}
                variant="contained"
              >
                Close
              </Button>
            </div>
          </Stack>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Customer Name"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="name"
              />
              <TextField
                fullWidth
                label="Transaction Amount"
                name="transaction"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="number"
              />
            </Stack>
            <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
              Continue
            </Button>
          </form>
        </div>
      </Box>
    </Popover>
  );
};

TransactionPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
