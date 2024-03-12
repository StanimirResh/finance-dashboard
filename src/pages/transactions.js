import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TransactionsTable } from "src/sections/transaction/transactions-table";
import { TransactionsSearch } from "src/sections/transaction/transactions-search";
import { applyPagination } from "src/utils/apply-pagination";
import { TransactionPopover } from "src/sections/transaction/add-transaction";
import { usePopover } from "src/hooks/use-popover";
import { Main } from "next/document";
const now = new Date();

const data = await fetch(
  "https://finance-dashb-default-rtdb.europe-west1.firebasedatabase.app/transactions.json"
)
  .then((data) => data.json())
  .then((data) => {
    return Object.entries(data);
  });

console.log(data);

const useTransactions = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useTransactionIds = (transactions) => {
  return useMemo(() => {
    return transactions.map((transaction) => transaction[0]);
  }, [transactions]);
};

const Page = () => {
  const transactionPopover = usePopover();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const transactions = useTransactions(page, rowsPerPage);
  const transactionIds = useTransactionIds(transactions);
  const transactionSelection = useSelection(transactionIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const mainStyles = {
    flexGrow: 1,
    py: 8,

    //When add button is clicked make the other elements blurred
    ...(transactionPopover.open && {
      filter: "blur(3px)",
    }),
  };

  return (
    <>
      <Head>
        <title>Transactions | Devias Kit</title>
      </Head>
      <Box component="main" sx={mainStyles}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Transactions</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={transactionPopover.handleOpen}
                  ref={transactionPopover.anchorRef}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <TransactionsSearch />
            <TransactionsTable
              count={data.length}
              items={transactions}
              onDeselectAll={transactionSelection.handleDeselectAll}
              onDeselectOne={transactionSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={transactionSelection.handleSelectAll}
              onSelectOne={transactionSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={transactionSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
      <TransactionPopover open={transactionPopover.open} onClose={transactionPopover.handleClose} />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
