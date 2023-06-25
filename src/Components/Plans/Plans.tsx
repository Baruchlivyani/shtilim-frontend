import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import { Button, IconButton, Snackbar } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import PlanService from '../../Services/PlanService';
import IPlanModel, { QuizModel, ReportingType, Type } from '../../Models/IPlanModel';

const Plans = () => {
  const [plans, setPlans] = useState<IPlanModel[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<IPlanModel | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const fetchedPlans = await PlanService.getAllPlans();
        setPlans(fetchedPlans);
      } catch (error: any) {
        // Handle the error appropriately (e.g., show an error message)
        console.error('Failed to fetch plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const handleDeletePlan = (plan: IPlanModel) => {
    setSelectedPlan(plan);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedPlan) {
      try {
        await PlanService.deletePlan(selectedPlan._id);
        setDeleteConfirmationOpen(false);
        setSelectedPlan(null);
        setPlans(plans.filter((plan) => plan._id !== selectedPlan._id));
        setSnackbarMessage('Plan deleted successfully.');
        setSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage('Failed to delete plan.');
        setSnackbarOpen(true);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setSelectedPlan(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Plan Name',
      width: 200,
    },
    {
      field: 'numberOfQuestions',
      headerName: 'Number of Questions',
      width: 200,
      valueGetter: (params: GridCellParams) => {
        const plan = params.row as IPlanModel;
        return plan.quiz.length;
      },
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridCellParams) => (
          <div>
            <IconButton component={Link} to={`/update-plan/${params.row._id}`}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeletePlan(params.row as IPlanModel)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ),
        
      },
  ];

  return (
    <div>
      <h1>Plans</h1>
      <DataGrid
        rows={plans}
        columns={columns}
        autoHeight
        checkboxSelection
        disableRowSelectionOnClick
      />
      <Dialog open={deleteConfirmationOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Plan</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this plan?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        autoHideDuration={3000}
      />
    </div>
  );
};

export default Plans;