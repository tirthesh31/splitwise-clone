import { StyleSheet } from "react-native";
import Colors from "../utils/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
  },
  backButton: {
    padding: 10,
  },
  headerIconContainer:{
    display:'flex',
    flexDirection:'row',
    width:80,
    justifyContent:'space-between'
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  summaryCard: {
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 10,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expenseIconContainer: {
    backgroundColor: '#5D9CEC20',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  expenseIcon: {},
  expenseDetails: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  expenseSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5D9CEC',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberIconContainer: {
    backgroundColor: '#48CFAD20',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  memberIcon: {},
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  memberBalanceContainer: {
    flexDirection: 'row',
  },
  memberPaid: {
    fontSize: 14,
    marginRight: 15,
  },
  memberOwed: {
    fontSize: 14,
  },
  memberBalanceStatus: {
    padding: 10,
    borderRadius: 25,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F5F7FB',
  },
  addButton: {
    backgroundColor: '#5D9CEC',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default styles;